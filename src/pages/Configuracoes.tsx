import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { User, Mail, Phone, Key, Settings, Edit, Save, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Configuracoes = () => {
  const { user, isEmailVerified } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [editingFields, setEditingFields] = useState({
    fullName: false,
    email: false,
    phone: false
  });

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user,
        email: user.email
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = (field: keyof typeof editingFields) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveField = (field: keyof typeof editingFields) => {
    console.log(`Salvando campo ${field}:`, formData[field as keyof typeof formData]);
    // Aqui será implementada a lógica de salvamento individual
    setEditingFields(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleSavePassword = () => {
    if (!isEmailVerified) return;
    
    console.log('Iniciando processo de alteração de senha:', {
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    });
    
    // Aqui será implementada a lógica para enviar código por email
    setShowVerificationModal(true);
  };

  const handleVerificationSubmit = () => {
    console.log('Código de verificação:', verificationCode);
    // Aqui será implementada a lógica de verificação do código
    setShowVerificationModal(false);
    setVerificationCode('');
    setFormData(prev => ({
      ...prev,
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Dados mockados das estatísticas
  const stats = {
    reputacao: 4.2,
    totalVendas: 1847,
    receitaMes: 12450.80,
    produtosAtivos: 234,
    avaliacoes: 892,
    performance: 98.5
  };

  return (
    <div className="h-full flex flex-col">
      {/* Título da Página */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 text-lg">Gerencie suas informações pessoais e estatísticas da conta</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Seção do Avatar e Informações Básicas */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={user?.user} />
                  <AvatarFallback className="text-lg font-semibold">
                    {user?.user ? getInitials(user.user) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user?.user}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">ID do Vendedor: {user?.sellerId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <Input 
                      id="fullName" 
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Seu nome completo"
                      disabled={!editingFields.fullName}
                      className={!editingFields.fullName ? "bg-gray-50 pr-10" : "pr-10"}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => editingFields.fullName ? handleSaveField('fullName') : handleEditToggle('fullName')}
                    >
                      {editingFields.fullName ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-between">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    {isEmailVerified ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verificado
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Não Verificado
                      </Badge>
                    )}
                  </div>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      disabled={!editingFields.email}
                      className={!editingFields.email ? "bg-gray-50 pr-10" : "pr-10"}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => editingFields.email ? handleSaveField('email') : handleEditToggle('email')}
                    >
                      {editingFields.email ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </Label>
                  <div className="relative">
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      disabled={!editingFields.phone}
                      className={!editingFields.phone ? "bg-gray-50 pr-10" : "pr-10"}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => editingFields.phone ? handleSaveField('phone') : handleEditToggle('phone')}
                    >
                      {editingFields.phone ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerId" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ID do Vendedor
                  </Label>
                  <Input 
                    id="sellerId" 
                    value={user?.sellerId || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção de Alteração de Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="********" 
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="********" 
                  />
                </div>

                <Button 
                  onClick={handleSavePassword} 
                  disabled={!isEmailVerified}
                  className="px-8 h-10"
                >
                  Salvar Alterações
                </Button>
              </div>
              
              {/* Email not verified warning */}
              {!isEmailVerified && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Você precisa verificar seu email antes de alterar a senha.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas da Conta */}
        <div className="flex flex-col space-y-6 h-full">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 border-gray-200 border rounded-lg bg-gray-50">
                <span className="text-sm font-medium">Reputação:</span>
                <span className="text-sm font-medium">{stats.reputacao}</span>
              </div>

              <div className="flex items-center justify-between p-2 border-gray-200 border rounded-lg bg-gray-50">
                <span className="text-sm font-medium">Receita do Mês:</span>
                <span className="text-sm font-medium">
                  R$ {stats.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 border-gray-200 border rounded-lg bg-gray-50">
                <span className="text-sm font-medium">Produtos Ativos:</span>
                <span className="text-sm font-medium">{stats.produtosAtivos}</span>
              </div>

              <div className="flex items-center justify-between p-2 border-gray-200 border rounded-lg bg-gray-50">
                <span className="text-sm font-medium">Total de Vendas:</span>
                <span className="text-sm font-medium">{stats.totalVendas.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-2 border-gray-200 border rounded-lg bg-gray-50">
                <span className="text-sm font-medium">Avaliações:</span>
                <span className="text-sm font-medium">{stats.avaliacoes}</span>
              </div>

              <div className="flex items-center justify-between p-2 border-gray-200 border rounded-lg bg-gray-50">
                <span className="text-sm font-medium">Performance:</span>
                <span className="text-sm font-medium">{stats.performance}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold leading-none tracking-tight">Status da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conta Verificada:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    ✓ Verificada
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nível do Vendedor:</span>
                  <Badge variant="secondary">Premium</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Última Sincronização:</span>
                  <span className="text-xs text-gray-500">Há 2 horas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Verificação por Código */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Verificação por Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <p className="text-center text-gray-600">
              Enviamos um código de 6 dígitos para seu email. 
              Digite o código abaixo para confirmar a alteração da senha.
            </p>
            
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={(value) => setVerificationCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex justify-center space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationCode('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleVerificationSubmit}
                disabled={verificationCode.length !== 6}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Configuracoes;
